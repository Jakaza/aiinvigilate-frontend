
import React from 'react';
import { BookOpen } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Module } from './types';
import { getStatusClass } from './utils';

interface ModuleTableProps {
  modules: Module[];
  statusFilter: string;
  onFilterChange: (filter: string) => void;
  onModuleClick: (moduleCode: string) => void;
}

const ModuleTable: React.FC<ModuleTableProps> = ({ 
  modules, 
  statusFilter, 
  onFilterChange, 
  onModuleClick 
}) => {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-eduAccent" />
          My Modules
        </h2>
        
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <select
            className="bg-white border border-gray-300 text-eduText-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-eduAccent"
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="all">All Modules</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Module Name</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length > 0 ? (
              modules.map((module) => (
                <TableRow 
                  key={module.code} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onModuleClick(module.code)}
                >
                  <TableCell className="font-medium">{module.code}</TableCell>
                  <TableCell>{module.name}</TableCell>
                  <TableCell className="text-center">{module.credits}</TableCell>
                  <TableCell className="text-center">{module.grade}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(module.completionStatus)}`}>
                      {module.completionStatus === "in-progress" 
                        ? "In Progress" 
                        : module.completionStatus.charAt(0).toUpperCase() + module.completionStatus.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No modules found matching the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
};

export default ModuleTable;
