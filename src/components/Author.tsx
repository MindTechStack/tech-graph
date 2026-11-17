import resumeUrl from "../../content/Maksym_Matsydulskas_Resume.pdf?url";

export const AUTHOR_NAME = "Maksym Matsydulskas";

export function ResumeLink() {
  return (
    <a className="author-bar__resume" href={resumeUrl} target="_blank" rel="noopener">
      Résumé <span className="author-bar__format">PDF</span>
    </a>
  );
}
