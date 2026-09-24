declare module "pull-to-refresh-react" {
  import React from "react";

  /**
   * PullToRefresh Component options
   */
  export interface PullToRefreshOptions {
    pullDownHeight?: number;
    contentBackgroundColor?: string;
  }

  export interface PullToRefreshProps {
     
    onRefresh: (() => Promise<any>) | (() => void);
    textError?: string;
    textStart?: string;
    textReady?: string;
    textRefresh?: string;
    options?: PullToRefreshOptions;
    children: JSX.Element;
  }

  const PullToRefresh: React.ComponentType<PullToRefreshProps>;
  export default PullToRefresh;
}
