import React from 'react';
import { ComponentData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Text } from '../ui/Text';
import { Image } from '../ui/Image';
import { Table } from '../ui/Table';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { CustomFunction } from '../ui/CustomFunction';
import { ModalComponent } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { Form } from '../ui/Form';
import { DatePicker } from '../ui/DatePicker';

interface RenderComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const RenderComponent: React.FC<RenderComponentProps> = ({ 
  component, 
  isPreview = false 
}) => {
  // Apply custom CSS if provided
  const customStyle = component.customCSS ? {
    ...component.style,
  } : component.style;

  const componentProps = {
    component: { ...component, style: customStyle },
    isPreview
  };

  // Execute custom JavaScript if provided and in preview mode
  React.useEffect(() => {
    if (isPreview && component.customJS) {
      try {
        new Function('component', component.customJS)(component);
      } catch (error) {
        console.error('Error executing custom JS for component:', component.id, error);
      }
    }
  }, [component, isPreview]);

  switch (component.type) {
    case 'button':
      return <Button {...componentProps} />;
    
    case 'input':
      return <Input {...componentProps} />;
    
    case 'text':
      return <Text {...componentProps} />;
    
    case 'image':
      return <Image {...componentProps} />;
    
    case 'table':
      return <Table {...componentProps} />;
    
    case 'select':
      return <Select {...componentProps} />;
    
    case 'checkbox':
      return <Checkbox {...componentProps} />;
    
    case 'customfunction':
      return <CustomFunction {...componentProps} />;

    case 'modal':
      return <ModalComponent {...componentProps} />;

    case 'tabs':
      return <Tabs {...componentProps} />;

    case 'form':
      return <Form {...componentProps} />;

    case 'datepicker':
      return <DatePicker {...componentProps} />;

    default:
      return (
        <div 
          style={customStyle}
          className="bg-gray-200 flex items-center justify-center text-gray-600 text-sm border-2 border-dashed border-gray-400 rounded"
        >
          Unknown Component: {component.type}
        </div>
      );
  }
};