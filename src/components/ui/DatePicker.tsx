import React, { useState } from 'react';
import { ComponentData } from '../../types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const DatePicker: React.FC<DatePickerComponentProps> = ({ component, isPreview = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    component.props.value ? new Date(component.props.value) : null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const format = component.props.format || 'MM/DD/YYYY';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === currentMonth.getFullYear() &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getDate() === day
    );
  };

  if (!component.props.visible) return null;

  return (
    <div style={baseStyle} className="relative">
      <div>
        {component.props.label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {component.props.label}
            {component.props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            type="text"
            value={formatDate(selectedDate)}
            onClick={() => setIsOpen(!isOpen)}
            readOnly
            placeholder={component.props.placeholder || 'Select date...'}
            disabled={component.props.disabled}
            className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              component.props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-sm font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>

              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-md transition-colors
                      ${selected
                        ? 'bg-blue-600 text-white font-semibold'
                        : today
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-gray-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {component.props.showTodayButton && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    setCurrentMonth(today);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Today
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
