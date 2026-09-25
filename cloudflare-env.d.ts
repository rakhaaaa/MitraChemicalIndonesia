declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ADMIN_EMAILS?: string;
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_AUD?: string;
    NOTIFICATION_EMAIL?: string;
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
  }
}
