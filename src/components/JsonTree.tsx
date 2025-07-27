
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface JsonTreeProps {
  data: any;
  level?: number;
}

const JsonTree: React.FC<JsonTreeProps> = ({ data, level = 0 }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyValue = (value: any) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    toast({
      title: "Copied to clipboard",
      description: "Value has been copied to your clipboard",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'text-green-600 dark:text-green-400';
      case 'number':
        return 'text-blue-600 dark:text-blue-400';
      case 'boolean':
        return 'text-purple-600 dark:text-purple-400';
      case 'object':
        return 'text-orange-600 dark:text-orange-400';
      case 'array':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const renderValue = (key: string, value: any, index: number) => {
    const type = getType(value);
    const isCollapsed = collapsed[`${level}-${key}-${index}`];
    const isExpandable = type === 'object' || type === 'array';
    
    return (
      <div key={`${key}-${index}`} className={`${level > 0 ? 'ml-4' : ''} mb-2`}>
        <div className="flex items-center space-x-2 group">
          {isExpandable && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => toggleCollapse(`${level}-${key}-${index}`)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          {!isExpandable && <div className="w-6" />}
          
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {key}:
          </span>
          
          <span className={`font-mono text-sm ${getTypeColor(type)}`}>
            {type}
          </span>
          
          {!isExpandable && (
            <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
              {type === 'string' ? `"${value}"` : String(value)}
            </span>
          )}
          
          {isExpandable && !isCollapsed && (
            <span className="text-gray-500 text-sm">
              {type === 'array' ? `[${value.length}]` : `{${Object.keys(value).length}}`}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyValue(value)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        
        {isExpandable && !isCollapsed && (
          <div className="ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {type === 'array' ? (
              value.map((item: any, idx: number) => 
                renderValue(`[${idx}]`, item, idx)
              )
            ) : (
              Object.entries(value).map(([k, v], idx) => 
                renderValue(k, v, idx)
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {typeof data === 'object' && data !== null ? (
        Array.isArray(data) ? (
          data.map((item, index) => renderValue(`[${index}]`, item, index))
        ) : (
          Object.entries(data).map(([key, value], index) => 
            renderValue(key, value, index)
          )
        )
      ) : (
        <div className="text-gray-600 dark:text-gray-400 font-mono">
          {JSON.stringify(data, null, 2)}
        </div>
      )}
    </div>
  );
};

export default JsonTree;
