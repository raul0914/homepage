/*
 * Supabase接続設定
 * -----------------------------------------------------------
 * ブログ記事データ（homepage_blog_posts テーブル）の読み書きに使用します。
 * ここに書かれている anon key は公開しても問題のないキーです
 * （読み取りは誰でも可、書き込みはログインしたユーザーのみRLSで許可）。
 * -----------------------------------------------------------
 */
var SUPABASE_URL = 'https://hxawxnvuiloxtjphsrot.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4YXd4bnZ1aWxveHRqcGhzcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NzIzNzksImV4cCI6MjEwMTA0ODM3OX0.ysebWMPb7c1lNZ_9UnfEHz2wKCXUy2A_LjHFoIImtXQ';

var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'syarousi-homepage' }
});
