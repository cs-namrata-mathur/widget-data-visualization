| [Home](../README.md) |
|----------------------|

# Installation
1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appears, search **Data Visualization** widget.
3. Click to open the **Data Visualization** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

The **Data Visualization** widget provides four types of visualizations: Heat Map, Sunburst, Tree Map, and Word Cloud. Each can be rendered using static or live data, with the configuration depending on the selected data source.

## Visualization Type Selection

| Fields             | Description                              |
| ------------------ | ---------------------------------------- |
| Title              | Specify a title for the visualization as it should appear on the dashboard or report. |
| Visualization Type | Select the type of visualization to display data in the preferred format on the dashboard or report. You can choose from the following options: Heat Map, Sunburst, Tree Map, or Word Cloud. |

## Data Source Selection

| Fields      | Description                              |
| ----------- | ---------------------------------------- |
| Data Source | Choose between static or live data for rendering the visualization. You can select: **Record Containing JSON Data** or **Get Live Data**. <br /> - **Record Containing JSON Data**: Renders static data from a single record containing a JSON object, which contains all data for populating the visualization.<br /> - **Get Live Data**: Displays dynamic data, where nodes and links are generated based on the selected module and fields. |

### Record Containing JSON Data option

This option uses static data for rendering the visualization. Use the following fields to customize the selected visualization:

| Fields            | Description                              |
| ----------------- | ---------------------------------------- |
| Source            | Select the module containing the records to be displayed. The chosen module must include a JSON data field. For example, the `Key Store` module. |
| Select JSON Field | Select the field (column) of the selected module that contains the `JSON` data. Only JSON-type fields will appear in the drop-down. |
| Filter Criteria   | Define conditions (key) to filter data,  ensuring only relevant records are retrieved for the visualization. |

### Get Live Data option

This option renders the visualization using real-time data from the selected module and fields. Each visualization type has its specific configuration.

#### Heath Map - Get Live Data Option

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose records will be displayed. For example, **_Alerts_**. |
| X-Axis          | Select the picklist or DateTime field to be used as a category on the horizontal axis of the chart. For example, **_Severity_**. |
| Y-Axis          | Select the picklist or DateTime field to be used as a category on the vertical axis of the chart. For example, **_Status_**. <br />If you choose a DateTime field on the X-Axis or the Y-Axis, e.g., **_Created On_**, then you must configure the following additional options: <br /> - **X-Axis**/**Y-Axis Date Range****: Select the date range for which to populate the data. Choose between **Monthly** or **Daily**.<br /> - **X-Axis**/**Y-Axis Date Format**: Select the date format to display the data. Choose between **Month Year** or **Month Day**. |
| Color Threshold | Select the color to represent the minimum or lower level values in the grid using the **Min** picker. <br />Select the color to represent the maximum or higher level values in the grid using the **Max** picker. |
| Filter Criteria | Define conditions (key) to filter data, ensuring only relevant records are retrieved for the visualization. |

#### Sunburst and Tree Map - Get Live Data Option

The configuration for both Sunburst and Tree Map visualizations is identical:

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose records will be displayed. For example, **_Alerts_**. |
| Level 1         | Select the picklist to group records in the selected module. <br />The **Sunburst** chart, represents data in concentric circles with the picklist selected for Level 1 representing the root category at the center of the circular chart. For example, **_Severity_**. Successive levels represent subcategories, forming the outer circles.<br />The **Tree Map** chart, represents data in nested rectangles, with Level 1 representing the top-level or parent categories,  while each successive level corresponds to subcategories, i.e., the nested rectangles.<br />**NOTE**: For MSSP setups, the 'Tenant' lookup field is also supported for grouping of records. |
| Level 2         | Select the picklist to group records in the selected module at the **_second_** hierarchical level. For example, **_Type_**. |
| Level 3         | Select the picklist to group records in the selected module at the **_third_** hierarchical level. For example, **_Status_**. |
| Filter Criteria | Define conditions (key) to filter data, ensuring only relevant records are retrieved for the visualization. |

#### Word Cloud - Get Live Data Option

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Source          | Select the FortiSOAR™ module whose text data will be visualized. For example, **_Alerts_**. |
| Word Source     | Select the picklist or text field to group records in the selected module as a source for generating the Word Cloud. For example, **_Severity_**. |
| Filter Criteria | Define conditions (key) to filter data, ensuring only relevant records are retrieved for the visualization. |

## 

| [Usage](./usage.md) |
|---------------------|