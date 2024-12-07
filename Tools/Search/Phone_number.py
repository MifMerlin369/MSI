import argparse
import phonenumbers
from phonenumbers import carrier, geocoder, timezone
from termcolor import colored


def parse_and_validate_number(phone_number_str):
    """
    Parse and validate a phone number.
    
    Args:
        phone_number_str (str): Phone number in string format.
    
    Returns:
        phonenumbers.PhoneNumber: Parsed phone number object if valid.
    
    Raises:
        phonenumbers.phonenumberutil.NumberParseException: If the phone number is invalid.
    """
    # Add "+" if not present at the beginning
    if not phone_number_str.startswith('+'):
        phone_number_str = '+' + phone_number_str

    phone_number = phonenumbers.parse(phone_number_str, None)
    if not phonenumbers.is_valid_number(phone_number):
        raise phonenumbers.phonenumberutil.NumberParseException(
            0, "Invalid phone number!"
        )
    return phone_number


def extract_phone_info(phone_number):
    """
    Extract relevant information about a phone number.
    
    Args:
        phone_number (phonenumbers.PhoneNumber): Parsed phone number object.
    
    Returns:
        dict: Dictionary containing phone number information.
    """
    region_code = phonenumbers.region_code_for_number(phone_number)
    country = geocoder.description_for_number(phone_number, "en")
    operator = carrier.name_for_number(phone_number, "en")
    country_prefix = phone_number.country_code
    location = geocoder.description_for_number(phone_number, "en")
    sms_possible = phonenumbers.is_possible_number(phone_number)
    international_format = phonenumbers.format_number(
        phone_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL
    )
    national_format = phonenumbers.format_number(
        phone_number, phonenumbers.PhoneNumberFormat.NATIONAL
    )
    time_zones = timezone.time_zones_for_number(phone_number)
    number_type = carrier.number_type(phone_number)

    return {
        "Country": country,
        "Operator": operator,
        "Country Prefix": f"+{country_prefix}",
        "International Format": international_format,
        "National Format": national_format,
        "Location": location,
        "Region Code": region_code,
        "Timezone(s)": ", ".join(time_zones),
        "SMS Possible": "Yes" if sms_possible else "No",
        "Number Type": number_type,
    }


def display_phone_info(info):
    """
    Display phone number information in a formatted way.
    
    Args:
        info (dict): Dictionary containing phone number information.
    """
    print(colored("Phone Number Information:", "cyan"))
    for key, value in info.items():
        print(colored(f"{key}:", "yellow"), colored(value, "green"))


def main(args=None):
    """
    Main function to parse arguments and display phone number information.
    """
    parser = argparse.ArgumentParser(
    prog='PhoneInfo',
    formatter_class=argparse.RawDescriptionHelpFormatter,
    description="Analyze phone numbers and display details such as country, operator, and timezone.",
    epilog="""Supports multiple numbers, displaying key info like international format and validity.

[Mif Merlin (MSI)]"""
)
    parser.add_argument(
        "-n", "--number",
        required=True,
        nargs='+',  # Accept multiple numbers as a list
        help="List of phone numbers to analyze (e.g., +1xxxxxx +33xxxxx)."
    )

    args = parser.parse_args(args)

    # Process each phone number provided
    for phone_number_str in args.number:
        phone_number_str = phone_number_str.strip()  # Clean up any spaces
        try:
            # Parse and validate the phone number
            phone_number = parse_and_validate_number(phone_number_str)
            
            # Extract information
            info = extract_phone_info(phone_number)
            
            # Display the extracted information
            display_phone_info(info)
            print("\n")

        except phonenumbers.phonenumberutil.NumberParseException as e:
            print(colored(f"Error with number {phone_number_str}: {e}", "red"))
        except Exception as e:
            print(colored(f"An unexpected error occurred with number {phone_number_str}: {e}", "red"))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nKeyboard interruption detected. Exiting the program.")
    except Exception as e:
        print(f"An error occurred: {e}")
