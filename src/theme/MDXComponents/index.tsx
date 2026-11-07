import type {ComponentProps} from 'react';
import MDXComponents from '@theme-original/MDXComponents';

export default {
  ...MDXComponents,
  // Infima tables scroll horizontally; keyboard readers must be able to enter them.
  table: (props: ComponentProps<'table'>) => <table tabIndex={0} {...props} />,
};
