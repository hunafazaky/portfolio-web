// Mirrors internal/dto/*.go in portfolio-backend field-for-field (public
// response shapes only — admin/request shapes live closer to where the
// dashboard pages use them, added as those pages are built).

export type Profile = {
  name: string;
  title: string;
  summary: string;
  speed_read: string;
  resume_pdf_url: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
};

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  project_url: string;
  repo_url: string;
  image_url: string;
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  field: string;
  category: "formal" | "informal" | "";
  description: string;
  start_date: string | null;
  end_date: string | null;
};

export type Skill = {
  id: number;
  name: string;
  icon_key: string;
  category: string;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  category: string;
  issue_date: string | null;
  credential_url: string;
  image_url: string;
};
