#!/usr/bin/env python3
import argparse
import json
import os
import time
from datetime import datetime
from pathlib import Path


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "event",
        type=Path,
        help="event.json file")
    parser.add_argument(
        "metadata_dir",
        type=Path,
        help="metadata dir")
    return parser.parse_args()


def format_timestamp(date, start_time):
    s = date + " " + start_time.split(" ")[0]
    return int(time.mktime(datetime.strptime(s, "%d.%m.%Y %H:%M").timetuple()))


def main():
    args = parse_arguments()
    if args.event.is_file():
        event_file = open(args.event)
        event = json.load(event_file)
        event_file.close()
    else:
        exit("event.json file not found!")
    metadata_path = args.metadata_dir
    if not metadata_path.is_dir():
        os.makedirs(metadata_path)

    timestamp = format_timestamp(event["date"], event["time"])
    zones = list(event["zones"].keys())

    for zone in zones:
        for seat in range(1, event["zones"][zone]["seats"] + 1):
            ticket_id = f"{timestamp}{zones.index(zone)}{seat}"
            content = {
                "description": f"{event['title']} am {event['date']}, {event['time']}",
                "external_url": f"<Link zur Webseite>/{ticket_id}",
                "image": "ipfs://<hash>",
                "name": f"Ticket {ticket_id}",
                "attributes": [
                    {
                        "trait_type": "Titel",
                        "value": event["title"]
                    },
                    {
                        "display_type": "date",
                        "trait_type": "Datum",
                        "value": event["date"]
                    },
                    {
                        "trait_type": "Zeit",
                        "value": event["time"]
                    },
                    {
                        "trait_type": "Zone",
                        "value": zone
                    },
                    {
                        "trait_type": "Sitz",
                        "value": seat
                    },
                    {
                        "trait_type": "Preis",
                        "value": event["zones"][zone]["price"]
                    },
                    {
                        "display_type": "number",
                        "trait_type": "Ticket-ID",
                        "value": ticket_id
                    }
                ]
            }
            filename = os.path.join(metadata_path, f"{ticket_id}.json")
            with open(filename, "w") as file:
                json.dump(content, file, indent=4)


if __name__ == '__main__':
    main()
