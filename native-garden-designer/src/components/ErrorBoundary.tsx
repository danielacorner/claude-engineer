import { Html } from "@react-three/drei";
import React from "react";

class ErrorBoundary extends React.Component<{
  fallback?: React.ReactNode;
  threeD?: boolean;
  children: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: Error) {
    console.log(_error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ||
        (this.props.threeD ? (
          <Html>
            <h1>Something went wrong.</h1>
          </Html>
        ) : (
          <h1>Something went wrong.</h1>
        ))
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
