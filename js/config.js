var OFFICE_CONFIG_DEFAULTS = {
  officeName: "本部長社会保険労務士事務所",
  phone: "03-1234-5678",
  fax: "03-1234-5679",
  email: "info@honbucho-sr.example.com",
  postalCode: "〒103-0027",
  address: "東京都中央区日本橋1-2-3 日本橋ビル5F",
  businessHours: "平日 9:00〜18:00",
  closedDays: "土日祝休み",
  representative: "本部長 太郎",
  representativeKana: "ほんぶちょう たろう",
  representativeTitle: "特定社会保険労務士",
  registrationNumber: "第13XXXXXX号",
  association: "東京都社会保険労務士会",
  serviceArea: "東京都、神奈川県、千葉県、埼玉県（オンライン相談は全国対応）",
  qualifications: "社会保険労務士 / 第一種衛生管理者 / メンタルヘルス・マネジメント検定Ⅱ種",
  profileBio1: "大学卒業後、企業の人事部門で10年以上の実務経験を積んだ後、社会保険労務士資格を取得し独立開業。企業内での経験を活かし、現場目線に立った実務的なアドバイスを得意としています。",
  profileBio2: "「企業と従業員の双方が安心して働ける環境づくり」をモットーに、中小企業を中心に幅広い業種のお客様をサポートしています。",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8281!2d139.7745!3d35.6812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQwJzUyLjMiTiAxMznCsDQ2JzI4LjIiRQ!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp",
  accessInfo: "東京メトロ銀座線・東西線「日本橋駅」B9出口より徒歩3分\n都営浅草線「日本橋駅」D2出口より徒歩5分\nJR各線「東京駅」八重洲北口より徒歩10分",
  formActionUrl: "https://formspree.io/f/your-form-id",
  retainerPricing: [
    { range: "1〜4人", price: "¥20,000", services: "労務相談、手続代行、各種届出" },
    { range: "5〜9人", price: "¥30,000", services: "労務相談、手続代行、各種届出" },
    { range: "10〜19人", price: "¥40,000", services: "労務相談、手続代行、各種届出、就業規則点検" },
    { range: "20〜29人", price: "¥50,000", services: "労務相談、手続代行、各種届出、就業規則点検" },
    { range: "30〜49人", price: "¥70,000", services: "労務相談、手続代行、各種届出、就業規則点検、助成金診断" },
    { range: "50人以上", price: "別途お見積り", services: "フルサポート対応" }
  ],
  spotPricing: [
    { service: "就業規則 新規作成", price: "¥150,000〜", note: "ヒアリング・作成・届出まで一括対応" },
    { service: "就業規則 変更・改訂", price: "¥50,000〜", note: "改訂箇所の規模により変動" },
    { service: "賃金規程 作成", price: "¥100,000〜", note: "" },
    { service: "育児介護休業規程 作成", price: "¥80,000〜", note: "" },
    { service: "36協定 届出", price: "¥20,000", note: "特別条項付きは ¥30,000" },
    { service: "助成金 申請代行", price: "受給額の20%", note: "着手金なし・完全成功報酬型" },
    { service: "障害年金 裁定請求", price: "年金額の2ヶ月分", note: "着手金 ¥30,000（受給時に充当）" }
  ],
  payrollPricing: [
    { range: "1〜5人", base: "¥15,000", perPerson: "—" },
    { range: "6〜10人", base: "¥20,000", perPerson: "¥1,000 / 人" },
    { range: "11〜20人", base: "¥25,000", perPerson: "¥1,000 / 人" },
    { range: "21人以上", base: "別途お見積り", perPerson: "—" }
  ]
};

function getConfig() {
  try {
    var saved = localStorage.getItem('officeConfig');
    if (saved) {
      var parsed = JSON.parse(saved);
      var merged = {};
      for (var key in OFFICE_CONFIG_DEFAULTS) {
        merged[key] = parsed.hasOwnProperty(key) ? parsed[key] : OFFICE_CONFIG_DEFAULTS[key];
      }
      return merged;
    }
  } catch (e) {}
  return OFFICE_CONFIG_DEFAULTS;
}

var OFFICE_CONFIG = getConfig();

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function applyConfig() {
  var c = OFFICE_CONFIG;

  document.querySelectorAll('[data-config]').forEach(function(el) {
    var key = el.getAttribute('data-config');
    if (!c.hasOwnProperty(key)) return;
    var val = c[key];

    var hrefType = el.getAttribute('data-config-href');
    if (hrefType) {
      el.setAttribute('href', hrefType + val);
    }

    var srcAttr = el.getAttribute('data-config-src');
    if (srcAttr) {
      el.setAttribute('src', c[srcAttr] || val);
      return;
    }

    if (el.hasAttribute('data-config-action')) {
      el.setAttribute('action', val);
      return;
    }

    el.textContent = val;
  });

  // Address with line breaks
  document.querySelectorAll('[data-config-address]').forEach(function(el) {
    el.innerHTML = escapeHtml(c.postalCode) + '<br>' + escapeHtml(c.address);
  });

  // Full hours display
  document.querySelectorAll('[data-config-hours-full]').forEach(function(el) {
    el.textContent = c.businessHours + '（' + c.closedDays + '）';
  });

  // Copyright
  document.querySelectorAll('[data-config-copyright]').forEach(function(el) {
    el.innerHTML = '&copy; ' + new Date().getFullYear() + ' ' + escapeHtml(c.officeName) + ' All Rights Reserved.';
  });

  // Registration info in footer
  document.querySelectorAll('[data-config-registration]').forEach(function(el) {
    el.innerHTML = '社会保険労務士登録番号: ' + escapeHtml(c.registrationNumber) + '<br>' + escapeHtml(c.association) + '所属';
  });

  // Pricing tables
  applyPricingTable('retainerTable', c.retainerPricing, ['range', 'price', 'services']);
  applyPricingTable('spotTable', c.spotPricing, ['service', 'price', 'note']);
  applyPricingTable('payrollTable', c.payrollPricing, ['range', 'base', 'perPerson']);

  // Access info
  document.querySelectorAll('[data-config-access]').forEach(function(el) {
    var lines = c.accessInfo.split('\n');
    el.innerHTML = lines.map(function(l) { return '<li style="padding:0.4rem 0;">・' + escapeHtml(l) + '</li>'; }).join('');
  });

  // JSON-LD update
  var ldScript = document.querySelector('script[type="application/ld+json"]');
  if (ldScript) {
    try {
      var ld = JSON.parse(ldScript.textContent);
      if (ld['@type'] === 'LegalService') {
        ld.name = c.officeName;
        ld.telephone = c.phone;
        if (ld.address) {
          ld.address.streetAddress = c.address;
          ld.address.postalCode = c.postalCode.replace('〒', '');
        }
        ldScript.textContent = JSON.stringify(ld, null, 2);
      }
    } catch (e) {}
  }

  // Map iframes
  document.querySelectorAll('[data-config-map]').forEach(function(el) {
    if (c.mapEmbedUrl) el.setAttribute('src', c.mapEmbedUrl);
  });
}

function applyPricingTable(tableId, data, fields) {
  var table = document.getElementById(tableId);
  if (!table || !data) return;
  var tbody = table.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  data.forEach(function(row) {
    var tr = document.createElement('tr');
    fields.forEach(function(f, i) {
      var td = document.createElement('td');
      td.textContent = row[f] || '';
      if (i === 1) td.className = 'price';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', applyConfig);
