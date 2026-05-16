# Data Capture Prod Issue

: Yes
Date: March 27, 2026
LINK: https://chat360-jira.atlassian.net/browse/AA-384
Task Type: Issue

Based on the Slack activity from March 27th, 2026, here's what happened recently:

**API Performance Issues**

Several critical API endpoints experienced high latency issues:

- **Assigned Listing API** (`/api/clientwidget_updated/assigned/listing`) had latency spikes reaching 1.0s, exceeding the 600ms threshold [[1]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774624472260519). This issue was later resolved with latency dropping to 0.0s [[2]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774624352377139).
- **Website Login API** (`/api/auth/wesite-login-user`) experienced similar latency problems, reaching 1.0s against a 500ms threshold [[3]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774624301600539). This was also resolved later [[4]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774623821454259).
- **Live Chat Widget Performance** had 527 issues within 15 minutes, though still below the 1000 issue threshold [[5]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774624445389449). This recovered with issues dropping to 479 [[6]](https://chat360workspace.slack.com/archives/C09GTV597RP/p1774624264632069).

**Infrastructure Alerts**

The infrastructure experienced significant memory and load issues:

**Memory Usage Alerts**

Multiple servers exceeded the 80% memory threshold with critical alerts firing throughout the day:

- **API servers**: API 2, API 4, and API 6 all showed memory usage between 80-96% [[7]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774622780449219) [[8]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774622180452089) [[9]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774620080468889)
- **Worker servers**: Workers 1, 3, 4, 6, and 7 experienced high memory usage, with some reaching over 95% [[7]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774622780449219) [[10]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774619780453479) [[11]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774619480431009)

**Load Average Spikes**

Several production servers experienced high load averages:

- **Production Database**: 5-minute load average reached 16.56, above the 8.00 threshold [[12]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774622162472599), later resolved [[13]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774623662783759)
- **Worker Servers**: prod-workers-1 and prod-workers-2 had load spikes with 1-minute and 5-minute averages exceeding thresholds [[14]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774621719447669) [[15]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774621805546529), which were subsequently resolved [[16]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774621119440209) [[17]](https://chat360workspace.slack.com/archives/C041NCXCQ5U/p1774622405893879)
