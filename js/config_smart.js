/**
 * @file config_smart.js
 * @description スマートテーマ用のオフィス設定オーバーライド。
 *              基本設定を上書きし、労務DXコンサルティング nanobanana2社労士事務所の情報を設定します。
 */

(function() {
  if (typeof OFFICE_CONFIG_DEFAULTS !== 'undefined') {
    OFFICE_CONFIG_DEFAULTS.officeName = "労務DXコンサルティング nanobanana2社労士事務所";
    OFFICE_CONFIG_DEFAULTS.email = "info@smart.nanobanana2-sr.example.com";
    OFFICE_CONFIG_DEFAULTS.representative = "七野 バナナ";
    OFFICE_CONFIG_DEFAULTS.representativeKana = "ななの ばなな";
    
    // グローバルオブジェクトも再設定
    if (typeof OFFICE_CONFIG !== 'undefined') {
      OFFICE_CONFIG.officeName = OFFICE_CONFIG_DEFAULTS.officeName;
      OFFICE_CONFIG.email = OFFICE_CONFIG_DEFAULTS.email;
      OFFICE_CONFIG.representative = OFFICE_CONFIG_DEFAULTS.representative;
      OFFICE_CONFIG.representativeKana = OFFICE_CONFIG_DEFAULTS.representativeKana;
    }
  }
})();
