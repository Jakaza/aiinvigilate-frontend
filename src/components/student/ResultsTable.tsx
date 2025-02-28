
import React from 'react';
import { Award } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestResult } from './types';

interface ResultsTableProps {
  results: TestResult[];
  onViewDetails: (result: TestResult) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onViewDetails }) => {
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold flex items-center mb-6">
        <Award className="mr-2 h-5 w-5 text-eduAccent" />
        Test Results
      </h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length > 0 ? (
              results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell>{result.module}</TableCell>
                  <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg">{result.score}%</span>
                      <Progress value={(result.score / result.maxScore) * 100} className="h-2 w-24 mt-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(result)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No test results available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
};

export default ResultsTable;
