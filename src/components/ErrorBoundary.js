import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';

class ErrorBoundary extends React.Component {
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
      const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
      return (
        <div className={`flex-1 flex justify-center items-center p-4 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`flex flex-col items-center p-6 rounded-2xl shadow-md max-w-md ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <IoAlertCircle size={48} color="#FF3B30" />
            
            <h2 className={`text-xl font-bold mt-4 mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Что-то пошло не так
            </h2>
            
            <p className={`text-sm text-center mb-5 leading-5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
              Приносим извинения. Произошла ошибка при отображении этой страницы.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className={`w-full p-3 rounded-lg mb-4 max-h-[150px] overflow-auto ${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-[#f5f5f5]'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#333]'}`}>
                  Детали ошибки (dev mode):
                </p>
                <p className={`text-[11px] font-mono ${isDarkMode ? 'text-[#999]' : 'text-[#666]'}`}>
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

export default ErrorBoundary;
