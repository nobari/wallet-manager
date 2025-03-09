import {ReactNode} from 'react';

export interface ExternalLinkProps {
  title: string;
  description: string;
  href: string;
  className?: string;
}

export interface PageLayoutProps {
  children?: ReactNode;
  title: ReactNode;
}
