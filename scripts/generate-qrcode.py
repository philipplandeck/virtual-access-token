#!/usr/bin/env python3
import argparse
import os
from pathlib import Path

import qrcode


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "contractAddress",
        type=str,
        help="Address of the contract")
    parser.add_argument(
        "--qr-dir",
        dest="qr_dir",
        type=str,
        help="Path where to store the created QR codes")
    return parser.parse_args()


def main():
    args = parse_arguments()
    contractAddress = args.contractAddress
    qrcodePath = Path(args.qr_dir if args.qr_dir is not None else os.path.join(
        "contracts", "qrcodes"))
    if not os.path.exists(qrcodePath):
        os.makedirs(qrcodePath)
    filename = os.path.join(qrcodePath, f"{contractAddress}.png")

    # Linking the contract on Etherscan like this only makes sence if the
    # contract is verified and methods to verify the authenticity are
    # accessible via the readContract section of the page
    link = f"https://goerli.etherscan.io/address/{contractAddress}#readContract"

    qr = qrcode.QRCode(
        version=1,
        box_size=20,
        border=1)
    qr.add_data(link)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color=(217, 217, 217))
    img.save(filename)
    print(f"File {filename} was created successfully!")


if __name__ == '__main__':
    main()
