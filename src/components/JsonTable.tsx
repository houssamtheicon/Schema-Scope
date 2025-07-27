
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface JsonTableProps {
  data: any;
}

interface TableRow {
  path: string;
  type: string;
  value: string;
  description: string;
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
  const { toast } = useToast();

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "Value has been copied to your clipboard",
    });
  };

  const getType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const getDescription = (value: any): string => {
    const type = getType(value);
    
    switch (type) {
      case 'array':
        return `Array with ${value.length} items`;
      case 'object':
        return `Object with ${Object.keys(value).length} properties`;
      case 'string':
        return `String (${value.length} characters)`;
      case 'number':
        return Number.isInteger(value) ? 'Integer' : 'Float';
      case 'boolean':
        return 'Boolean';
      case 'null':
        return 'Null value';
      default:
        return type;
    }
  };

  const flattenObject = (obj: any, parentPath: string = ''): TableRow[] => {
    const result: TableRow[] = [];
    
    if (typeof obj !== 'object' || obj === null) {
      return [{
        path: parentPath || 'root',
        type: getType(obj),
        value: JSON.stringify(obj),
        description: getDescription(obj)
      }];
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const currentPath = parentPath ? `${parentPath}[${index}]` : `[${index}]`;
        if (typeof item === 'object' && item !== null) {
          result.push(...flattenObject(item, currentPath));
        } else {
          result.push({
            path: currentPath,
            type: getType(item),
            value: JSON.stringify(item),
            description: getDescription(item)
          });
        }
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          result.push(...flattenObject(value, currentPath));
        } else {
          result.push({
            path: currentPath,
            type: getType(value),
            value: JSON.stringify(value),
            description: getDescription(value)
          });
        }
      });
    }
    
    return result;
  };

  const tableData = flattenObject(data);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'number':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'boolean':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'object':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'array':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'null':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Path</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead width="50">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm font-medium">
                {row.path}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(row.type)}`}>
                  {row.type}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm max-w-xs truncate">
                {row.value}
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {row.description}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6"
                  onClick={() => copyValue(row.value)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JsonTable;
