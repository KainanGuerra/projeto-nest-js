export interface SendEmailInterface {
  personalizations: Personalization[];
  from: From2;
  reply_to: ReplyTo;
  subject: string;
  content: Content[];
}

export interface Personalization {
  to: To[];
  cc?: Cc[];
  bcc?: Bcc[];
  from?: From;
}

export interface To {
  email: string;
  name: string;
}

export interface Cc {
  email: string;
  name: string;
}

export interface Bcc {
  email: string;
  name: string;
}

export interface From {
  email: string;
  name: string;
}

export interface From2 {
  email: string;
  name: string;
}

export interface ReplyTo {
  email: string;
  name: string;
}

export interface Content {
  type: string;
  value: string;
}

export interface Attachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

export interface Asm {
  group_id: number;
  groups_to_display: number[];
}

export interface MailSettings {
  bypass_list_management: BypassListManagement;
  footer: Footer;
  sandbox_mode: SandboxMode;
}

export interface BypassListManagement {
  enable: boolean;
}

export interface Footer {
  enable: boolean;
}

export interface SandboxMode {
  enable: boolean;
}

export interface TrackingSettings {
  click_tracking: ClickTracking;
  open_tracking: OpenTracking;
  subscription_tracking: SubscriptionTracking;
}

export interface ClickTracking {
  enable: boolean;
  enable_text: boolean;
}

export interface OpenTracking {
  enable: boolean;
  substitution_tag: string;
}

export interface SubscriptionTracking {
  enable: boolean;
}
