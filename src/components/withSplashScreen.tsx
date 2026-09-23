import React, { Component, ComponentType } from "react";
import whiteLogo from "@/assets/images/COZA-Logo-white.svg";
import blackLogo from "@/assets/images/COZA-Logo-black.svg";

 
function SplashMessage(): JSX.Element {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    if (matches) {
      return (
        <div className="h-svh w-svh flex justify-center items-center">
          <img src={whiteLogo} className="App-logo" alt="logo" />
        </div>
      );
    } else {
      return (
        <div className="h-svh w-svh flex justify-center items-center">
          <img src={blackLogo} className="App-logo" alt="logo" />
        </div>
      );
    }
  });
  return (
    <div className="h-svh w-svh flex justify-center items-center">
      <img src={whiteLogo} className="App-logo" alt="logo" />
    </div>
  );
}

interface WithSplashScreenProps {
  // Add any props that WrappedComponent may receive
}

export default function withSplashScreen<T extends WithSplashScreenProps>(
  WrappedComponent: ComponentType<T>
): React.ComponentType<T> {
  return class extends Component<T, { loading: boolean }> {
    constructor(props: T) {
      super(props);
      this.state = {
        loading: true
      };
    }

    async componentDidMount() {
      try {
        // Put here your await requests/ API requests
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 1000);
      } catch (err) {
        console.log(err);
        this.setState({
          loading: false
        });
      }
    }

    render() {
      // while checking user session, show "loading" message
      if (this.state.loading) return SplashMessage();

      // otherwise, show the desired route
      return <WrappedComponent {...this.props} />;
    }
  };
}
