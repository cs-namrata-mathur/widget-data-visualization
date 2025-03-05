| [Home](../README.md) |
|----------------------|

# Installation
1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appears, search **Data Visualization** widget.
3. Click to open the **Data Visualization** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

The **Data Visualization** widget contains the following four types of visualization: Heat Map, Sunburst, Tree Map, and Word Cloud. Each of these visualizations can be can be rendered using static or live data and the configuration of the visualization depends on the selected type of data source.

## Visualization Type Selection

| Fields             | Description                              |
| ------------------ | ---------------------------------------- |
| Title              | Specify a title for the visualization as it should appear on the dashboard or report. |
| Visualization Type | Select the type of visualization you want to display on the dashboard or report. You can choose from the following options: Heat Map, Sunburst, Tree Map, and Word Cloud |

## Data Source Selection

| Fields      | Description                              |
| ----------- | ---------------------------------------- |
| Data Source | Select whether you want to use static or live data to render the chart. You can choose between: **Record Containing JSON Data** or **Get Live Data**. <br />The **Record Containing JSON Data** option renders static data using a single keystore record that contains a JSON object, which contains all data for populating the visualization.<br />The **Get Live Data**  option dynamically render nodes and links data. The live data is queried based on the selected module and fields. |

### Record Containing JSON Data option

Selecting this option renders the visualization based on static data. The following table helps customize the selected visualization when the **Record Containing JSON Data** option is selected:

| Fields            | Description                              |
| ----------------- | ---------------------------------------- |
| Source            | Select the module whose records are to be displayed. The module that you select must contain JSON data. For example, the `Key Store` module. |
| Select JSON Field | Select the field (Column) of the module that contains the `JSON` data. Only JSON-type fields are available in the drop-down. |
| Filter Criteria   | Define the conditions (key) to filter data so that only relevant records are retrieved and used in the visualization. |

### Get Live Data option

Selecting this option renders the visualization based on real-time data for the selected module and fields. Each visualization has its own configurations using which live data is displayed.

#### Heath Map - Get Live Data Option

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose records are to be displayed. For example, **_Alerts_**. |
| X-Axis          | Select the field to be used as a category on the chart's horizontal axis. For example, **_Severity_**. |
| Y-Axis          | Select the field to be used as a category on the chart's vertical axis. For example, **_Status_**. <br />If you select a DateTime field in the Y-Axis, for example, **_Created On_**, then you must specify the following additional parameters: <br /> - **Y-Axis Date Range**: Select the date range for which you want to populate the data. Choose between Monthly or Daily<br /> - **Y-Axis Date Format**: Select the date format to display the data.  Choose between Month Year or Month Day. |
| Filter Criteria | Define the conditions to filter data so that only relevant records are retrieved and used in the visualization. |

#### Sunburst and Tree Map - Get Live Data Option

Configuration for the Sunburst and Tree Map visualizations are the same

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose records are to be displayed. For example, **_Alerts_**. |
| Level 1         | Select the picklist to group records in the selected module. <br />The **Sunburst** chart visualizes data in a circular format, so the picklist selected in Level 1 is the **_root_** category of the hierarchical dataset appearing in the center of the circle and is used to drill-down to other hierarchical levels. For example, **_Severity_**. Each successive level representing subcategories, i.e., the outer circles.<br />The **Tree Map** chart uses nested rectangles to display data, with Level 1 signifying the top-level or parent categories and each successive level representing subcategories, i.e., the nested rectangles. |
| Level 2         | Select the picklist to group records in the selected module. The picklist selected in Level 2 is the **_second_** level of the hierarchical dataset. For example, **_Type_**. |
| Level 3         | Select the picklist to group records in the selected module. The picklist selected in Level 3 is the **_third_** level of the hierarchical dataset. For example, **_Status_**. |
| Filter Criteria | Define the conditions to filter data so that only relevant records are retrieved and used in the visualization. |

#### Word Cloud - Get Live Data Option

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose records are to be displayed. For example, **_Alerts_**. |
| Word Source     | Select the picklist to group records in the selected module. For example, **_Type_**. |
| Filter Criteria | Define the conditions to filter data so that only relevant records are retrieved and used in the visualization. |

## Next Steps

| [Usage](./usage.md) |
|---------------------|