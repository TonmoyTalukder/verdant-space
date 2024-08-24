import { css } from '@emotion/css';

export const getLinearGradientButtonStyle = (rootPrefixCls: string) => css`
  &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
    border-width: 0;

    > span {
      position: relative;
    }

    &::before {
      content: "";
      background: linear-gradient(135deg, #628753, #15241d);
      position: absolute;
      inset: 0;
      opacity: 1;
      transition: all 0.3s;
      border-radius: inherit;
    }

    &:hover::before {
      opacity: 1;
      background: linear-gradient(135deg, #d69f11, #826b30); /* Gold gradient */
    }
  }
`;
