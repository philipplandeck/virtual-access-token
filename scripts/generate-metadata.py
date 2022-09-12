#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "event",
        type=str,
        help="Path of the event.json file")
    parser.add_argument(
        "--metadata-dir",
        dest="metadata_dir",
        type=str,
        help="Path where to store the created metadata files")
    return parser.parse_args()


def main():
    args = parse_arguments()
    event_path = Path(args.event)
    if event_path.is_file():
        event_file = open(event_path)
        event = json.load(event_file)
        event_file.close()
    else:
        exit("event.json file not found!")
    metadata_path = Path(args.metadata_dir if args.metadata_dir is not None else os.path.join(
        "example", "metadata"))
    if not os.path.exists(metadata_path):
        os.makedirs(metadata_path)

    for zone in event["zones"].keys():
        for seat in range(1, event["zones"][zone]["seats"] + 1):
            content = {
                "description": f"Ticket for sport event {event['title']} on {event['date']}",
                "image": "ipfs://TBD",
                "name": f"{event['title']} on {event['date']}",
                "attributes": {
                    "title": event["title"],
                    "date": event["date"],
                    "time": event["time"],
                    "zone": zone,
                    "seat": seat,
                    "price": event["zones"][zone]["price"],
                }
            }
            filename = os.path.join(
                metadata_path, f"zone{zone}seat{seat}.json")
            with open(filename, "w") as file:
                json.dump(content, file, indent=4)


if __name__ == '__main__':
    main()
