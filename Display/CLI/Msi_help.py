from rich.console import Console

def help_msi():
    console = Console()

    help_text = """
[bold cyan]MSI Shell - User Guide[/]
--------------------------------------------
[bold]MSI Shell[/] is a customized command-line environment offering a variety of features to simplify command management and execution.

[bold]Main Commands:[/]
  - [bold]msi -h[/], [bold]msi --help[/]       : Displays this help menu.
  - [bold]msi -p[/], [bold]msi --prompt[/]    : Changes the command prompt.
  - [bold]msi -c[/], [bold]msi --cmd[/]       : Lists available MSI programs.

[bold]Features:[/]
  - [bold]Auto-completion[/]         : Automatically completes system commands and file paths, reducing errors and speeding up navigation.
  - [bold]Command history[/]         : Tracks previously executed commands for quick recall and reuse.
  - [bold]Password mode[/]           : Masks input for secure entries, ideal for sensitive information like passwords.

[bold]Keyboard Shortcuts:[/]
  - [bold]Ctrl + Space[/] : Toggles auto-completion on/off.
  - [bold]Ctrl + T[/]     : Toggles "ghost" mode (input masking).
  - [bold]Ctrl + H[/]     : Opens the quick help menu.

[bold]Additional Information:[/]
  - [cyan]MSI Shell is designed to provide an intuitive and powerful interface for running scripts and commands.[/]
  - [bold]Documentation:[/] [cyan]https://github.com/MifMerlin369/MSI[/]

For any questions or assistance, please refer to the online documentation or the included help files.

[bold italic cyan]Explore endless possibilities with MSI![/]
    """
    console.print(help_text)

if __name__ == "__main__":
    help_msi()
