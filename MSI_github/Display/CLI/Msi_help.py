from rich.console import Console

def help_msi():
    console = Console()

    help_text = """
    [bold cyan]MSI Shell[/]
    ---------------------------------
    [bold]MSI[/] Shell est un environnement de ligne de commande personnalisé offrant une variété de fonctionnalités
    2e ligne
    3e ligne

    [bold]Commandes :[/]
    # uniquement les commande  de guide
     . msi -h, msi --help           : Affiche cette aide.
     . msi -p, msi --prompt : changer l'invite.
     . msi -c, msi --cmd :  Affiche liste des programmes msi.

    [bold]Fonctionnalités :[/]
     . Auto-completion      : Auto-complétion des commandes système et des chemins de fichiers, réduisant ainsi
                             les erreurs de frappe et accélérant la navigation.
      .  Historique des commandes : Suivi des commandes précédemment exécutées pour un rappel et une réutilisation rapide.
     . Mode mot de passe    : Masque les entrées pour des saisies sécurisées, idéal pour les mots de passe et autres
                             informations sensibles.

    [bold]Raccourcis clavier :[/]
     . Ctrl + Espace        : Active/Désactive l'auto-complétion pendant la frappe.
     . Ctrl + T             : Active/Désactive le mode ghost (les entrées sont masquées).
     . Ctrl + h             : .....

    [bold]Informations supplémentaires :[/]
    [cyan]- MSI Shell est conçu pour…
     . Lignes 2
     . Vous pouvez envoyez vos code pour ajouter dans MSI. Cela augmentera sa…
     . Compatible avec les systèmes Unix et Windows.

    Pour toute autre question ou assistance, veuillez consulter la documentation ou les fichiers d'aide supplémentaires.
    [bold italic]MSI…[/][/]
    """
    console.print(help_text)

if __name__ == "__main__":
    help_msi()

