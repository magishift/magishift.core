export interface IMenuItems {
  href?: string;
  disabled?: string;
  target?: string;
  icon?: string;
  title?: string;
}

export interface IMenu {
  mainHeader?: string;
  divider?: boolean;
  href?: string;
  title?: string;
  icon?: string;
  header?: string;
  items?: IMenuItems[];
}
