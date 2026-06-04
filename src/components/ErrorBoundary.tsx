"use client"

import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-5xl mb-6">😵</p>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted mb-6">An unexpected error occurred while loading this page. Try refreshing.</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Refresh Page
          </button>
          {this.state.error && (
            <pre className="mt-6 text-left text-xs text-danger bg-card-bg rounded-lg p-4 overflow-auto max-h-48">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
