/**
 * @file config_friendly.js
 * @description 親しみテーマ用のオフィス設定オーバーライド。
 *              基本設定を上書きし、社会保険労務士法人 nanobanana2の情報を設定します。
 */

(function() {
  if (typeof OFFICE_CONFIG_DEFAULTS !== 'undefined') {
    OFFICE_CONFIG_DEFAULTS.officeName = "社会保険労務士法人 nanobanana2";
    OFFICE_CONFIG_DEFAULTS.email = "info@friendly.nanobanana2-sr.example.com";
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
