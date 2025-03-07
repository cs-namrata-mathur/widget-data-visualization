| [Home](../README.md) |
|----------------------|

# Usage

Data visualizations are sophisticated visual tools designed to represent complex datasets in an intuitive and insightful way. These charts incorporate elements like interactivity, multi-dimensional analysis, and advanced statistical visualizations.

## Sunburst

The Sunburst chart displays hierarchical data in a circular format using  concentric rings to represent different levels of the hierarchy. An example of a Sunburst visualization can be displaying **_Alerts_** data with **_Severity_** as its ***root*** category and **_Type_** and **_Status_** as subsequent categories.

### Use static data to visualize data in a Sunburst chart 

The **Record containing JSON Data** option helps retrieve and display data from a record that has values in the  `JSON` format. Select this option if all data to be rendered is in a specific field of a module. The widget has filters to select only that record that meets the filter conditions. 

For example, displaying a Sunburst chart that represents data from the **_Alerts_** module, with **_Severity_** as the root category, i.e., appearing as the center of the circle and each successive level representing subcategories, i.e., the outer circles, with **_Type_** as the second level and **_Status_** as the outermost circle. For our example, we have considered the 'Key Store' module.

#### Configuring the Sunburst chart using static data  <a name="configureStaticData"></a>

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.

    ![Dashboard - Add Widget](./res/sankey-edit-00.png)

2. Select **Data Visualization** from the list to bring up the **Data Visualization** widget's customization modal.

3. From the **Visualization Type** drop-down list, select **Sunburst**.

    ![Data Visualization Widget - Sunburst Visualization](./res/sankey-edit-01.png)

4. In the **Title** field, specify the title of the graphical representation. 

5. From the **Data Source** field, select the **Record Containing JSON Data** option.

6. From the **Source** drop-down list, select the module whose records contain `JSON` data. For our example, we have selected the 'Key Store' module. 

7. From the **Select JSON Field** drop-down list, select the field, whose data is to be displayed. The drop-down lists **_only_** the fields of type `JSON`. For our example, we have selected a field within the 'Key Store' module.

    A sample of a `JSON` type field is given [here](#sampleJson).

8. In the **Filter Criteria** field, select the keys of the JSON field using which data should be filtered and then appropriately fetched to be displayed in the chart. For our example, we want to display 'Alert Data' and therefore, `Key Equals Alert_Static_Data` is added as the filter condition.  
    ![Configuring Sunburst Visualization Using Alert Static Data](./res/sankey-edit-staticData-01.png)  

> [!NOTE]  
> The filter conditions should be such that they select **_only_** the record that contains relevant JSON data.

9. Click **Save** to save the configuration.

> [!TIP]  
> Follow the same procedure to configure all charts using static data.
### Use live data to visualize hierarchical data in the Sunburst widget

The **Get Live Data** option helps helps visualize hierarchical data as per current data. For example, viewing the alert data grouped hierarchically by severity, type, and status.

#### Configuring the Sunburst chart using live data <a name="configureLiveDataSunburst"></a>

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.
2. Select **Data Visualization** from the list to bring up the **Data Visualization** widget's customization modal.
3. From the **Visualization Type** drop-down list, select **Sunburst**.
4. In the **Title** field, specify the title of the graphical representation. 
5. From the **Data Source** field, select the **Get Live Data** option.
6. From the **Source** drop-down list, select the module, whose data is to be represented hierarchically in the Sunburst chart. For our example, select **Alerts**.
7. From the **Level 1** drop-down list, select the picklist to group records in the selected module. The picklist selected in Level 1 is the **_root_** category of the hierarchical dataset appearing in the center of the circle and is used to drill-down to other hierarchical levels. For example, **_Severity_**. Each successive level representing subcategories, i.e., the outer circles.
8. From the **Level 2** drop-down list, select the picklist that will be the **_second_** level of the hierarchical dataset, and appear at the second level in the circle.  For example, **_Type_**.
9. From the **Level 3** drop-down list, select the picklist that will be the **_third_** level of the hierarchical dataset, and appear at the outer-most level in the circle.  For example, **_Status_**.
10. (Optional) In the **Filter Criteria** field, specify the conditions to filter data so that only relevant records are retrieved and used in the visualization. For example, add the condition `Status Not Equals Closed`, to retrieve only those alert records that are not closed.
   To know more about using the filter criteria, refer to the [Nested Filter](https://docs.fortinet.com/document/fortisoar/7.6.2/user-guide/207943/dashboards-templates-and-widgets#Nested-Filters) section of the FortiSOAR™ User Guide.    
   ![Configuring Sunburst Visualization Using Alert Static Data](./res/sankey-edit-LiveData-01.png)    
11. Click **Save** to save the configuration.


### Sunburst chart representing Alert Data - View

The following image displays a **Sunburst** chart based on an example where you want to view Alert data grouped hierarchically with **_Severity_** appearing as the center of the circle, **_Type_** as the second circle and **_Status_** as the outermost circle:

![Displaying the Sunburst Chart on a Dashboard using live data](./res/soc-overview-sankey-static-data.png)

## Tree Map

The Tree Map chart displays hierarchical data using rectangles, with each rectangle representing a category, and subcategories are nested within their parent category. The hierarchy is visually represented through the size and placement of the rectangles.  An example of a Tree Map visualization can be displaying **_Alerts_** data with **_Severity_** as its ***root*** category, and **_Type_** and **_Status_** as subsequent categories.

### Use static data to visualize data in a Tree Map chart

The **Record containing JSON Data** option helps retrieve and display data from a record that has values in the  `JSON` format. Select this option if all data to be rendered is in a specific field of a module. The widget has filters to select only that record that meets the filter conditions. 

For example, displaying a Tree Map chart that represents data from the **_Alerts_** module with **_Severity_** as its ***root*** category, i.e., the parent rectangle,  and **_Type_** and **_Status_** as subsequent nested rectangles. For our example, we have considered the 'Key Store' module.

> [!NOTE]  
> The procedure for configuring Tree Map using static data is mentioned in the [Configuring the Sunburst chart using static data](#configureStaticData) section.

### Use live data to visualize hierarchical data in the Tree Map widget

The **Get Live Data** option helps helps visualize hierarchical data as per current data. For example, viewing the alert data grouped hierarchically by severity, type, and status.

#### Configuring the Tree Map chart using live data

The procedure for configuring Tree Map using live data is same as the Sunburst chart mentioned in the [Configuring the Sunburst chart using live data](#configureLiveDataSunburst) section. The point to note here is that in case of Tree Map the levels are represented by rectangles. The picklist selected to group alert data hierarchically at level 1 will be the parent rectangle and each successive level representing subcategories, i.e., the nested rectangles. For our example,  **_Severity_** is at level 1 (parent rectangle), **_Type_** is at level 2 (nested within parent rectangle), and **_Status_** is at level 3 (nested within level 2). 

### Tree Map chart representing Alert Data - View

The following image displays a **Tree Map** chart based on an example where you want to view Alert data grouped hierarchically with **_Severity_** appearing as parent rectangle, **_Type_** as the second rectangle (nested inside Severity) and **_Status_** as the inner-most nested rectangle:

![Displaying the Tree Map Chart on a Dashboard using static data](./res/soc-overview-sankey-static-data.png)

#### Sample JSON type field for Sunburst and Tree Map charts <a name="sampleJson"></a>

Following is a sample of a field that contains data in the `JSON` format, which can be rendered in the Sunburst or Tree Map charts:

```JSON
{
  "High": {
    "$count": 17,
    "Phishing": {
      "Open": {
        "$count": 1
      },
      "$count": 3,
      "Closed": {
        "$count": 1
      },
      "Investigating": {
        "$count": 1
      }
    },
    "Beaconing": {
      "Open": {
        "$count": 3
      },
      "$count": 5,
      "Closed": {
        "$count": 1
      },
      "Investigating": {
        "$count": 1
      }
    },
    "Denial of Service": {
      "Open": {
        "$count": 3
      },
      "$count": 9,
      "Closed": {
        "$count": 1
      },
      "Investigating": {
        "$count": 5
      }
    }
  },
  "Medium": {
    "$count": 14,
    "Phishing": {
      "Open": {
        "$count": 2
      },
      "$count": 6,
      "Closed": {
        "$count": 2
      },
      "Investigating": {
        "$count": 2
      }
    },
    "Beaconing": {
      "Open": {
        "$count": 2
      },
      "$count": 3,
      "Investigating": {
        "$count": 1
      }
    },
    "Denial of Service": {
      "Open": {
        "$count": 4
      },
      "$count": 5,
      "Investigating": {
        "$count": 1
      }
    }
  },
  "Critical": {
    "$count": 20,
    "Phishing": {
      "Open": {
        "$count": 3
      },
      "$count": 6,
      "Closed": {
        "$count": 1
      },
      "Investigating": {
        "$count": 2
      }
    },
    "Beaconing": {
      "Open": {
        "$count": 5
      },
      "$count": 9,
      "Investigating": {
        "$count": 4
      }
    },
    "Denial of Service": {
      "Open": {
        "$count": 2
      },
      "$count": 5,
      "Closed": {
        "$count": 2
      },
      "Investigating": {
        "$count": 1
      }
    }
  }
}
```

## Heat Map

The Heat Map chart displays data in a matrix where individual values are typically mapped to a gradient of colors. An example of a Heat Map visualization can be displaying **_Alerts_** data in a grid with **_Severity_** as its horizontal axis and **_Created On_** on its vertical axis along with the date range and format for the alerts. The Heat Map will display Alerts with the specified date range with cooler tones indicating lower severity and warmer tones indicating higher severity.

### Use static data to visualize data in a Heat Map chart

The **Record containing JSON Data** option helps retrieve and display data from a record that has values in the  `JSON` format. Select this option if all data to be rendered is in a specific field of a module. The widget has filters to select only that record that meets the filter conditions. 

> [!NOTE]  
> The procedure for configuring Heat Map using static data is mentioned in the [Configuring the Sunburst chart using static data](#configureStaticData) section.

A sample of a `JSON` type field is given [here](#sampleJsonHeatMap).

### Use live data to visualize data in the Heat Map widget

The **Get Live Data** option helps helps visualize data in a matrix as per current data. For example, viewing the alert data grouped in a matrix based on severity and created on fields.

#### Configuring the Heat Map chart using live data 

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.
2. Select **Data Visualization** from the list to bring up the **Data Visualization** widget's customization modal.
3. From the **Visualization Type** drop-down list, select **Heat Map**.
4. In the **Title** field, specify the title of the graphical representation. 
5. From the **Data Source** field, select the **Get Live Data** option.
6. From the **Source** drop-down list, select the module, whose data is to be represented as a grid in the Heat Map chart. For our example, select **Alerts**.
7. From the **X-Axis** drop-down list, select the field to be used as a category on the chart's horizontal axis. For example, **_Severity_**. 
8. From the **Y-Axis** drop-down list, select the field to be used as a category on the chart's vertical axis. For example, **_Created On_**.  
   If you select a DateTime field, from the **Y-Axis** drop-down list, such as selected in our example, i.e., the **_Created On_** field, then you must specify the following additional parameters:
    1. **Y-Axis Date Range**: Select the date range for which you want to populate the data. Choose between **Monthly** or **Daily**.
    2. **Y-Axis Date Format**: Select the date format to display the data. Choose between **Month Year** or **Month Day**.
9. (Optional) In the **Filter Criteria** field, specify the conditions to filter data so that only relevant records are retrieved and used in the visualization. 

   To know more about using the filter criteria, refer to the [Nested Filter](https://docs.fortinet.com/document/fortisoar/7.6.2/user-guide/207943/dashboards-templates-and-widgets#Nested-Filters) section of the FortiSOAR™ User Guide.    
   ![Configuring Heat Map Visualization Using Alert Live Data](./res/sankey-edit-LiveData-01.png)    
10. Click **Save** to save the configuration.

### Heat Map chart representing Alert Data - View

The following image displays a **Heat Map** chart based on an example where you want to view Alert data in a grid with **_Severity_** appearing as on the horizontal axis and **_Created On_** on the vertical axis based on the configured date range and format. The Heat Map displays Alerts with cooler tones indicating lower severity, such as 'Minimal', 'Low' and warmer tones indicating higher severity such as 'High', Critical.

#### Sample JSON type field for Heat Map chart <a name="sampleJsonHeatMap"></a>

Following is a sample of a field that contains data in the `JSON` format, which can be rendered in the Heat Map chart:

```JSON
{
  "data": [
    [
      0,
      0,
      11
    ],
    [
      0,
      1,
      14
    ],
    [
      0,
      2,
      14
    ],
    [
      1,
      0,
      13
    ],
    [
      1,
      1,
      17
    ],
    [
      1,
      2,
      5
    ],
    [
      2,
      0,
      15
    ],
    [
      2,
      1,
      22
    ],
    [
      2,
      2,
      11
    ],
    [
      3,
      0,
      13
    ],
    [
      3,
      1,
      12
    ],
    [
      3,
      2,
      6
    ],
    [
      4,
      0,
      10
    ],
    [
      4,
      1,
      18
    ],
    [
      4,
      2,
      3
    ]
  ],
  "xAxis": [
    "Minimal",
    "Low",
    "Medium",
    "High",
    "Critical"
  ],
  "yAxis": [
    "Jan 2025",
    "Feb 2025",
    "Mar 2025"
  ],
  "moduleName": "Alerts"
}
```
## Word Cloud

The Word Cloud is a visual representation of text data where the frequency of each word is shown with varying font sizes or colors. The size of each word in the cloud corresponds to its frequency in the dataset. An example of a Word Cloud visualization viewing the number of **_Alerts_** based on their **_Severity_**. The size of each severity will be based on the number of alerts that belong to that severity.

### Use static data to visualize data in a Word Cloud chart

The **Record containing JSON Data** option helps retrieve and display data from a record that has values in the  `JSON` format. Select this option if all data to be rendered is in a specific field of a module. The widget has filters to select only that record that meets the filter conditions. 

> [!NOTE]  
> The procedure for configuring Word Cloud using static data is mentioned in the [Configuring the Sunburst chart using static data](#configureStaticData) section.

A sample of a `JSON` type field is given [here](#sampleJsonWordCloud).

### Use live data to visualize data in the Word Cloud widget

The **Get Live Data** option helps helps visualize text data of the selected module as per current data. For example, viewing the number of alerts based on their severity.

#### Configuring the Word Cloud chart using live data

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.

2. Select **Data Visualization** from the list to bring up the **Data Visualization** widget's customization modal.

3. From the **Visualization Type** drop-down list, select **Word Cloud**.

4. In the **Title** field, specify the title of the graphical representation. 

5. From the **Data Source** field, select the **Get Live Data** option.

6. From the **Source** drop-down list, select the module, whose text data is to be visualized in the Word Cloud chart. For our example, select **Alerts**.

7. From the **Word Source** drop-down list, select the picklist to group records in the selected module. For example, **_Severity_**. 

8. (Optional) In the **Filter Criteria** field, specify the conditions to filter data so that only relevant records are retrieved and used in the visualization. 

   To know more about using the filter criteria, refer to the [Nested Filter](https://docs.fortinet.com/document/fortisoar/7.6.2/user-guide/207943/dashboards-templates-and-widgets#Nested-Filters) section of the FortiSOAR™ User Guide.    
   ![Configuring Word Cloud Visualization Using Alert Live Data](./res/sankey-edit-LiveData-01.png)    

9. Click **Save** to save the configuration.

### Word Cloud Map chart representing Alert Data - View

The following image displays a **Word Cloud** chart based on an example where you want to view the number of ***Alerts*** based on their **_Severity_**. The size of each severity will be based on the number of alerts that belong to that severity, for example if the maximum number of alerts are of 'Critical' severity, it will appear larger than for example 'High', which might have the lowest number of alerts.

#### Sample JSON type field for Word Cloud chart <a name="sampleJsonWordCloud"></a>

Following is a sample of a field that contains data in the `JSON` format, which can be rendered in the Word Cloud chart:

```JSON
[
  {
    "name": "Medium",
    "value": 270,
    "display": ""
  },
  {
    "name": "High",
    "value": 240,
    "display": ""
  },
  {
    "name": "Low",
    "value": 264,
    "display": ""
  },
  {
    "name": "Minimal",
    "value": 271,
    "display": ""
  },
  {
    "name": "Critical",
    "value": 308,
    "display": ""
  }
]
```

## Next Steps

| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) |
| --------------------------------------- | ---------------------------------------- |
