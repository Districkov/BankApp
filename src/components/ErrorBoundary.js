import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex justify-center items-center bg-[#F7F7FB] p-4">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md max-w-md">
            <IoAlertCircle size={48} color="#FF3B30" />
            
            <h2 className="text-xl font-bold text-black mt-4 mb-2 text-center">
              Что-то пошло не так
            </h2>
            
            <p className="text-sm text-[#666] text-center mb-5 leading-5">
              Приносим извинения. Произошла ошибка при отображении этой страницы.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="w-full bg-[#f5f5f5] p-3 rounded-lg mb-4 max-h-[150px] overflow-auto">
                <p className="text-xs font-semibold text-[#333] mb-2">
                  Детали ошибки (dev mode):
                </p>
                <p className="text-[11px] text-[#666] font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button 
              className="bg-primary px-6 py-3 rounded-lg w-full text-white text-base font-semibold hover:opacity-90 transition-opacity"
              onClick={this.handleReset}
            >
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
