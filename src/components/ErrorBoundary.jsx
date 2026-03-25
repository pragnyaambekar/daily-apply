import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 12, borderRadius: 14, padding: 40,
                        textAlign: 'center', background: '#ef444410', border: '1px solid #ef444430',
                    }}
                >
                    <AlertTriangle size={28} color="#ef4444" />
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#ef4444', margin: 0 }}>
                        Something went wrong.
                    </p>
                    {this.state.error && (
                        <pre style={{ fontSize: 11, color: '#ef4444', opacity: .7, maxWidth: 500, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: '#ef444420', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
