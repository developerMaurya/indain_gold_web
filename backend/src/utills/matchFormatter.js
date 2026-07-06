
export class MatchFormatter {
    /**
     * Formats match data from the EntitySport API.
     * @param {Object} match - RAW match object from EntitySport API.
     * @returns {Object} formattedMatch - Standardized match object.
     */
    static formatEntitySport(match) {
        let matchType = match.status_str || "Scheduled";
        let isLive;

        // Status Mapping: 1 -> Live, 2 -> Completed, 3 -> Upcoming , 4 or any number other than 1,2,3 -> Rejected
        if (match.status === 3) {
            matchType = "Live";
            isLive = true;
        } else if (match.status === 2) {
            matchType = "Completed";
            isLive = false;
        } else if (match.status === 1) {
            matchType = "Upcoming";
            isLive = false;
        } else if (matchType.toLowerCase() === "live") {
            isLive = true;
        }else{
            matchType = "Rejected";
            isLive = false;
        }

        return {
            match_id: match.match_id ? match.match_id.toString() : "",
            match_type: matchType,
            series_name: match.competition?.title || "",
            match_format: match.format_str || "",
            match_result_type: match.result || "",
            current_inning: match.latest_inning_number || 1,
            venue: {
                venue_id: match.venue?.venue_id || "",
                name: match.venue?.name || "",
                location: match.venue?.location || "",
                country: match.venue?.country || "",
                timezone: match.venue?.timezone || ""
            },
            date_time: match.date_start_ist || "",
            team_a: {
                name: match.teama?.name || "",
                short_name: match.teama?.short_name || "",
                logo: match.teama?.logo_url || "",
                team_id: match.teama?.team_id || "",
                score: match.teama?.scores_full || match.teama?.scores || "Yet to bat",
                overs: match.teama?.overs || "0"
            },
            team_b: {
                name: match.teamb?.name || "",
                short_name: match.teamb?.short_name || "",
                logo: match.teamb?.logo_url || "",
                team_id: match.teamb?.team_id || "",
                score: match.teamb?.scores_full || match.teamb?.scores || "Yet to bat",
                overs: match.teamb?.overs || "0"
            },
            status_note: match.status_note || "",
            is_live: isLive
        };
    }

    /**
     * Placeholder for formatting match data from another API provider.
     * @param {Object} match - RAW match object from Other API.
     * @returns {Object} formattedMatch - Standardized match object.
     */
    static formatOtherApi(match) {
        // Implement mapping logic for OTHER_API here
        return {
            match_id: match.id,
            // ... map fields accordingly
        };
    }
}
