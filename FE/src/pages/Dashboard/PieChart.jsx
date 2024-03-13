import { useState, useEffect, useCallback } from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

export default function SummaryPieChart() {
  const [chartSummary, setChartSummary] = useState({
    total: 0,
    finished: 0,
    ongoing: 0,
    todo: 0,
  });

  const getSummary = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/events/summary/month');
      const summaryData = {
        total: response.data.summary.totalEvents,
        finished: response.data.summary.totalFinishedEvents,
        ongoing: response.data.summary.totalOngoingEvents,
        todo: response.data.summary.totalTodoEvents,
      }
      setChartSummary(summaryData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setChartSummary])

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  return (
    <>
      {
        chartSummary.total > 0 ? (
          <PieChart
            series={[
              {
                data: [
                  { id: '0', value: chartSummary.finished, label: 'Finished', color: 'rgba(9, 175, 232, 0.8)' },
                  { id: '1', value: chartSummary.ongoing, label: 'Ongoing', color: 'rgba(41, 244, 153, 1)' },
                  { id: '2', value: chartSummary.todo, label: 'Todo', color: 'rgba(255, 109, 136, 1)' },
                ],
                innerRadius: 20,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={220}
          />
        ) : (
          <p>There are no new events in this month</p>
        )
      }
    </>
  )
}
