#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path

import qrcode


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "metadata_dir",
        type=Path,
        help="metadata dir")
    parser.add_argument(
        "qr_dir",
        type=Path,
        help="qr code dir")
    return parser.parse_args()


def main():
    args = parse_arguments()
    metadata_path = args.metadata_dir
    if not metadata_path.is_dir():
        os.makedirs(metadata_path)
    if not any(metadata_path.iterdir()):
        exit("Directory is empty!")
    qr_path = args.qr_dir
    if not qr_path.is_dir():
        os.makedirs(qr_path)

    for filename in os.listdir(metadata_path):
        file = open(os.path.join(metadata_path, filename))
        data = json.load(file)
        ticket_id = filename.split(".")[0]
        link = data["external_url"]
        file.close()

        qr_filename = os.path.join(qr_path, f"{ticket_id}.png")
        qr = qrcode.QRCode(
            version=1,
            box_size=20,
            border=1)
        qr.add_data(link)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color=(217, 217, 217))
        img.save(qr_filename)
        print(f"QR-code {qr_filename} was created successfully!")


if __name__ == '__main__':
    main()
