import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/client/components/ui/collapsible";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/client/components/ui/field";
import { Textarea } from "@/client/components/ui/textarea";
import type { useLaunchController } from "@/client/features/audit/launch/useLaunchController";
import { getFieldError } from "@/client/lib/forms";

type LaunchForm = ReturnType<typeof useLaunchController>["launchForm"];

/** Collapsed by default: most audits never limit or skip any paths. */
export function ExcludePathsField({ launchForm }: { launchForm: LaunchForm }) {
  return (
    <Collapsible className="lg:col-span-12">
      <CollapsibleTrigger className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
        <ChevronRight className="size-4 transition-transform group-data-panel-open:rotate-90" />
        Advanced
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-4 pt-3 md:grid-cols-2">
        <PathsTextarea
          launchForm={launchForm}
          name="includePathsInput"
          id="audit-include-paths"
          label="Only crawl these paths"
          placeholder={"/blog/\n/services/"}
          description={
            <>
              One path per line. Leave empty to crawl the whole site. Start the
              audit from a URL under one of these paths. Run one audit per
              section to cover a large site in batches.
            </>
          }
        />
        <PathsTextarea
          launchForm={launchForm}
          name="excludePathsInput"
          id="audit-exclude-paths"
          label="Exclude paths"
          placeholder={"/blog/\n/*/print"}
          description={
            <>
              One path per line. <code>/blog/</code> skips every page under
              /blog/, and <code>*</code> matches anything. Skipped pages aren't
              crawled and don't count toward Max pages.
            </>
          }
        />
      </CollapsibleContent>
      {/* Outside the panel, so a closed Advanced section can't hide errors. */}
      <PathsError launchForm={launchForm} name="includePathsInput" />
      <PathsError launchForm={launchForm} name="excludePathsInput" />
    </Collapsible>
  );
}

type PathsFieldName = "includePathsInput" | "excludePathsInput";

function PathsTextarea({
  launchForm,
  name,
  id,
  label,
  placeholder,
  description,
}: {
  launchForm: LaunchForm;
  name: PathsFieldName;
  id: string;
  label: string;
  placeholder: string;
  description: React.ReactNode;
}) {
  return (
    <launchForm.Field name={name}>
      {(field) => (
        <Field className="max-w-xl">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Textarea
            id={id}
            rows={3}
            className="font-mono"
            placeholder={placeholder}
            aria-invalid={getFieldError(field.state.meta.errors) ? true : undefined}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
          <FieldDescription>{description}</FieldDescription>
        </Field>
      )}
    </launchForm.Field>
  );
}

function PathsError({
  launchForm,
  name,
}: {
  launchForm: LaunchForm;
  name: PathsFieldName;
}) {
  return (
    <launchForm.Field name={name}>
      {(field) => {
        const error = getFieldError(field.state.meta.errors);
        return error ? <FieldError className="pt-2">{error}</FieldError> : null;
      }}
    </launchForm.Field>
  );
}
