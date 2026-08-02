/*
 * 簡易Markdown変換ユーティリティ（ブログ記事用）
 * -----------------------------------------------------------
 * 外部ライブラリなしで、記事下書き（frontmatter付きMarkdown）を
 * そのまま貼り付けられるようにするための最小限のパーサーです。
 * 対応記法: 見出し(#〜####) / 太字(**text**) / リンク([text](url))
 *          / 箇条書き(- item) / 番号リスト(1. item) / 段落
 * -----------------------------------------------------------
 */

function mdEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function mdInline(text) {
  var t = mdEscape(text);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return t;
}

/* Markdown本文 → HTML（見出しは記事タイトルとぶつからないよう h3/h4 に格上げ） */
function markdownToHtml(md) {
  if (!md) return '';
  var lines = String(md).replace(/\r\n/g, '\n').split('\n');
  var out = [];
  var i = 0;

  while (i < lines.length) {
    var line = lines[i];

    if (!line.trim()) { i++; continue; }
    if (/^-{3,}\s*$/.test(line.trim())) { i++; continue; }

    var h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      var level = Math.min(h[1].length + 1, 6);
      out.push('<h' + level + '>' + mdInline(h[2].trim()) + '</h' + level + '>');
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      var uitems = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        uitems.push('<li>' + mdInline(lines[i].replace(/^[-*]\s+/, '')) + '</li>');
        i++;
      }
      out.push('<ul>' + uitems.join('') + '</ul>');
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      var oitems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        oitems.push('<li>' + mdInline(lines[i].replace(/^\d+\.\s+/, '')) + '</li>');
        i++;
      }
      out.push('<ol>' + oitems.join('') + '</ol>');
      continue;
    }

    var para = [line];
    i++;
    while (i < lines.length && lines[i].trim() &&
           !/^#{1,4}\s+/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) &&
           !/^\d+\.\s+/.test(lines[i]) && !/^-{3,}\s*$/.test(lines[i].trim())) {
      para.push(lines[i]);
      i++;
    }
    out.push('<p>' + para.map(function (l) { return mdInline(l.trim()); }).join('<br>') + '</p>');
  }
  return out.join('\n');
}

/*
 * 記事下書き（frontmatter + 本文）を解析して
 * { title, date, excerpt, body } を返す。
 * - frontmatter（--- 〜 ---）の「タイトル:」を記事タイトルとして採用
 * - frontmatterの直後に「確認チェックリスト」等の内部メモ用の
 *   区切り（--- 〜 ---）がある場合は、公開しない内容として除去
 * - filename（例: 2026-08-02_〇〇.md）があれば日付を自動抽出
 */
function parseArticleMarkdown(raw, filename) {
  var text = String(raw || '').replace(/\r\n/g, '\n').trim();
  var result = { title: '', date: '', excerpt: '', body: text };
  if (!text) return result;

  var fm = {};
  var rest = text;
  var fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (fmMatch) {
    rest = text.slice(fmMatch[0].length);
    var currentKey = null;
    fmMatch[1].split('\n').forEach(function (line) {
      var kv = line.match(/^([^\s:：][^:：]*)[:：]\s*(.*)$/);
      if (kv && !/^\s*[-*]\s/.test(line)) {
        currentKey = kv[1].trim();
        fm[currentKey] = kv[2].trim();
      } else if (/^\s*[-*]\s+/.test(line) && currentKey) {
        fm[currentKey] = (fm[currentKey] ? fm[currentKey] + '\n' : '') + line.trim();
      }
    });
  }

  // frontmatterの後に内部メモ区切り（--- 〜 ---）があれば、公開範囲から除外
  var hrMatch = rest.match(/\n?-{3,}\s*\n/);
  if (hrMatch) {
    var idx = rest.indexOf(hrMatch[0]);
    var before = rest.slice(0, idx).trim();
    if (before && (/確認|チェック|メモ|memo/i.test(before) || before.length < 400)) {
      rest = rest.slice(idx + hrMatch[0].length);
    }
  }
  rest = rest.trim();

  var title = fm['タイトル'] || fm['title'] || fm['Title'] || '';
  if (!title) {
    var h1 = rest.match(/^#\s+(.+)$/m);
    if (h1) {
      title = h1[1].trim();
      rest = rest.replace(h1[0], '').trim();
    }
  }
  result.title = title;
  result.body = rest;

  var dateMatch = String(filename || '').match(/(\d{4}-\d{2}-\d{2})/) || text.match(/(\d{4}-\d{2}-\d{2})/);
  result.date = dateMatch ? dateMatch[1] : '';

  var paras = rest.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  var firstReal = null;
  for (var j = 0; j < paras.length; j++) {
    var p = paras[j];
    var isHeading = /^#{1,4}\s/.test(p);
    var isList = /^[-*]\s/.test(p) || /^\d+\.\s/.test(p);
    if (p.indexOf('※') !== 0 && !isHeading && !isList) {
      firstReal = p;
      break;
    }
  }
  var plain = (firstReal || paras[0] || '').replace(/^#{1,4}\s+/, '').replace(/\*\*/g, '');
  result.excerpt = plain.length > 90 ? plain.slice(0, 90) + '…' : plain;

  return result;
}
