import { InlineButton } from "components/button";
import { CheckedSmallIcon, UncheckedSmallIcon } from "components/icons";
import { Paragraph } from "components/typography";

type CheckboxProps = {
  label: string;
  checked: boolean;
};

export const Checkbox = ({ label, checked }: CheckboxProps) => {
  return (
    <InlineButton className="flex items-center">
      <span className="flex-none">
        {checked ? <CheckedSmallIcon /> : <UncheckedSmallIcon />}
      </span>

      <Paragraph
        className={`ml-3 text-left ${
          checked ? "!text-now-green" : "text-now-grey"
        }`}
      >
        {label}
      </Paragraph>
    </InlineButton>
  );
};
