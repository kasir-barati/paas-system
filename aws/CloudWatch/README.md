# CloudWatch

- Monitoring tool for your AWS resources and applications.
- Can create alarms that watch the metrics and send notifications or automatically make changes to the resources when a threshold is breached.
- Metrics have timestamps.
- No data aggregation between regions.
- Metrics for every service on AWS.
- Metric: A variable to monitor (CPUUtilization, NetworkIn, ...). You can find a complete list of all metrics [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)

## Glossary

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>Side notes</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Namespaces</td>
      <td>A container for CloudWatch metrics.</td>
      <td>
        Isolated from each other
        <small>
          (To prevent aggregating different apps' statistics in one place)
        </small>
        .
      </td>
    </tr>
    <tr>
      <td>Metrics</td>
      <td>A time-ordered set of data about the performance of your systems.</td>
      <td>
        <ul>
          <li>Region specific.</li>
          <li>
            By
            <span style="
                text-decoration: underline dotted;
                text-underline-offset: 0.1em;
                cursor: help;
              "
              title="Can be changed to 1 minute, but it is more expensive."
            >
              default
            </span>
            gathered every 5 minutes.
          </li>
          <li>
            <span
              style="
                text-decoration: underline dotted;
                text-underline-offset: 0.1em;
                cursor: help;
              "
              title="After 15 month of no new data."
            >
              Expires
            </span>,
            rather than being deletable.
          </li>
          <li>Delete data older than 15 month as new data comes in.</li>
          <li>
            Either specify timestamps or CloudWatch will create it for you.
          </li>
          <li>
            <b 
              style="
                text-decoration: underline dotted;
                text-underline-offset: 0.1em;
                cursor: help;
              "
              title="Install CloudWatch Agent in your instances first"
            >
              NO
            </b>
            memory utilization and disk space usage metrics by default for
            EC2 instances.
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Dimensions</td>
      <td>A key/value pair that uniquely identifies a metric.</td>
      <td>
        Whenever you add a unique dimension to one of your metrics, you are
        creating a new variation of that metric.
      </td>
    </tr>
    <tr>
      <td>Statistics</td>
      <td>Aggregated data over specified periods of time.</td>
      <td>
        <ul>
          <li>Specify a unit of measure are aggregated separately.</li>
          <li>
            Can specify a
            <span
              style="
                text-decoration: underline dotted;
                text-underline-offset: 0.1em;
                cursor: help;
              "
              title="Default unit: None"
            >
              unit
            </span>
            when you create a custom metric
          </li>
          <li>
            A
            <span
              style="
                text-decoration: underline dotted;
                text-underline-offset: 0.1em;
                cursor: help;
              "
              title="The default value is 60 seconds."
            >
              period
            </span>
            is the length of time associated with a specific CloudWatch
            statistic.
          </li>
          <li>
            Statistics are aggregated according to the period length that we
            specify.
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

[Learn more](https://tutorialsdojo.com/amazon-cloudwatch/)

## Some important metrics

| Service       | Metrics                                                |
| ------------- | ------------------------------------------------------ |
| EC2 instances | CPU Utilization.<br/>Status Checks.<br/>Network.       |
| EBS Volumes   | Disk read/write.                                       |
| S3 Buckets    | BucketSizeBytes.<br/>NumberOfObjects.<br/>AllRequests. |
| API usage     | CloudWatch<br/>Lambda.<br/>S3.                         |

But we can also create our own metrics.

## CloudWatch alarms

- Goes off when a metric breaches a predefined threshold.
  - Can be based on percentage/max/min or other units.
  - Can configure how frequently check whether we breached the threshold or not.
  - Can be in different states:
    - OK.
    - INSUFFICIENT_DATA.
    - ALARM.
- Actions they can perform:
  - Send a notification.
  - Auto scaling.
  - Perform EC2 actions: stop/terminate/reboot/recover.
  - SNS notifications.
- Billing alarms can help us with budget management.
