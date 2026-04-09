import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

export default function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
      { keys: ['Esc'], description: 'Close modal/dialog' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ]},
    { category: 'Actions', items: [
      { keys: ['Ctrl', 'S'], description: 'Save current changes' },
      { keys: ['Ctrl', 'P'], description: 'Print current view' },
      { keys: ['Ctrl', 'F'], description: 'Search' },
      { keys: ['Ctrl', 'R'], description: 'Refresh data' },
    ]},
    { category: 'Modules', items: [
      { keys: ['Alt', '1'], description: 'Go to Dashboard' },
      { keys: ['Alt', '2'], description: 'Go to Yard Management' },
      { keys: ['Alt', '3'], description: 'Go to Berth Planning' },
      { keys: ['Alt', '4'], description: 'Go to Container Stacking' },
    ]},
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Keyboard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            <h3 className="text-lg sm:text-xl text-emerald-400">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {shortcuts.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-base sm:text-lg text-slate-300 mb-2 sm:mb-3">{section.category}</h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-slate-300 text-xs sm:text-sm flex-1 min-w-0">{item.description}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {item.keys.map((key, keyIdx) => (
                          <div key={keyIdx} className="flex items-center gap-1">
                            {keyIdx > 0 && <span className="text-slate-500 text-xs">+</span>}
                            <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 min-w-[1.5rem] sm:min-w-[2rem] text-center">
                              {key}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50">
          <p className="text-xs sm:text-sm text-slate-400 text-center">
            Press <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-800 border border-slate-700 rounded text-xs mx-1">?</kbd> anytime to view shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}
