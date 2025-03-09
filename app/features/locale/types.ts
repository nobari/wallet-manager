export interface LocaleSwitcherProps {
  className?: string;
}

export interface LocaleSwitcherSelectProps {
  options: Array<{
    value: string;
    label: string;
  }>;
  defaultValue: string;
  label: string;
  className?: string;
}
