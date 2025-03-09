import {ThemeToggle} from '../../theme';
import {LocaleSwitcher} from '../../locale';

export function Header() {
  return (
    <>
      <ThemeToggle />
      <LocaleSwitcher />
    </>
  );
}
