import pandas as pd

# Load the Olympics data
data = pd.read_csv("archive/athlete_events.csv")

# Filter only for Summer Olympics
summer_data = data[data['Season'] == 'Summer']

# Extract relevant columns
summer_data = summer_data[['NOC', 'Year', 'Medal']]

# Group by NOC and Year, count medals for each type
medal_counts = summer_data.groupby(['NOC', 'Year'])['Medal'].value_counts().unstack().fillna(0)

# Calculate the total number of gold, silver, and bronze medals for each NOC
medal_counts['Total_Gold'] = medal_counts['Gold'].groupby('NOC').transform('sum')
medal_counts['Total_Silver'] = medal_counts['Silver'].groupby('NOC').transform('sum')
medal_counts['Total_Bronze'] = medal_counts['Bronze'].groupby('NOC').transform('sum')

# Rank the NOCs based on the number of gold, silver, and bronze medals
ranked = medal_counts[['Total_Gold', 'Total_Silver', 'Total_Bronze']].rank(method='max', ascending=False)

# Save the ranks to a CSV file
ranked.to_csv('ranked_by_medals.csv', header=True)
