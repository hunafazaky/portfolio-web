import { useTranslation } from "react-i18next";
import { Section } from "~/components/ui/Section";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import type { Certificate as CertificateType } from "~/lib/types";

export function Certificate({ certificates }: { certificates: CertificateType[] }) {
  const { t } = useTranslation();
  if (certificates.length === 0) return null;
  return (
    <Section id="certificates" title={t("sections.certificates")} side="right" wide tint="teal">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {certificates.map((c) => (
          <a
            key={c.id}
            href={c.credential_url || undefined}
            target={c.credential_url ? "_blank" : undefined}
            rel="noreferrer"
            className={c.credential_url ? "" : "pointer-events-none"}
          >
            <Card className="h-full">
              {c.image_url && (
                <img src={c.image_url} alt={c.title} className="mb-3 aspect-video rounded-md object-cover" />
              )}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                {c.category && <Badge>{c.category}</Badge>}
              </div>
              {c.issuer && <p className="mt-1 text-xs text-foreground-muted">{c.issuer}</p>}
            </Card>
          </a>
        ))}
      </div>
    </Section>
  );
}
