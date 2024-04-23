We want to add in the insights page a cumulative flow diagram using ant design charts. This should only show when filtering by a project, and should allow for filtering by date ranges. It should be similar to Jira's : https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-the-velocity-chart/

Example:

A velocity chart is a useful agile tool, often used in Scrum, to track the amount of work a team completes during a sprint. It helps in predicting the team's future sprint capacity. The chart typically shows the total story points (or any other estimation unit) completed in each sprint, allowing teams to visualize their velocity over time.



To create a velocity report using Ant Design Charts, follow these general steps:



### Step 1: Data Preparation

For the velocity chart, you will need historical sprint data that includes:

- Sprint names or numbers (e.g., Sprint 1, Sprint 2, etc.)

- The total estimation points (story points, hours, etc.) completed in each sprint



Assuming you have multiple sprints data, your dataset might look something like this:

```json

[

  { "sprint": "Sprint 1", "completedPoints": 20 },

  { "sprint": "Sprint 2", "completedPoints": 25 },

  // Add an entry for each sprint

]

```



### Step 2: Creating the Chart with Ant Design Charts

To visualize this data, a simple bar chart can effectively represent the velocity report. Here's an example of how you could implement it:



```javascript

import React from 'react';

import { Column } from '@ant-design/plots';



const VelocityChart = () => {

  const data = [

    { sprint: "Sprint 1", completedPoints: 20 },

    { sprint: "Sprint 2", completedPoints: 25 },

    // Add data for all sprints

  ];



  const config = {

    data,

    xField: 'sprint',

    yField: 'completedPoints',

    label: {

      // Display the data value on top of each bar

      position: 'middle',

      style: {

        fill: '#FFFFFF',

        opacity: 0.6,

      },

    },

    xAxis: {

      label: {

        autoHide: true,

        autoRotate: false,

      },

    },

    yAxis: {

      title: {

        text: 'Completed Points',

      },

    },

    meta: {

      sprint: {

        alias: 'Sprint',

      },

      completedPoints: {

        alias: 'Completed Points',

      },

    },

  };



  return <Column {...config} />;

};



export default VelocityChart;

```



### Step 3: Enhancements and Considerations

- **Dynamic Data:** If your project management tool provides an API, consider fetching sprint data dynamically to keep your velocity chart updated.

- **Comparing Estimates vs. Actuals:** For a more detailed analysis, you could add another bar for each sprint representing the estimated points planned at the beginning of the sprint versus the actual points completed. This requires adjusting your dataset and config to accommodate the additional data series.

- **Customization:** Ant Design Charts offers extensive customization options. Explore the documentation for features like tooltips, custom color schemes, interactive filters, and more to enhance your velocity chart.



By following these steps and adapting the example code to your specific needs, you can effectively visualize your team's velocity using Ant Design Charts, providing valuable insights for sprint planning and capacity forecasting.
