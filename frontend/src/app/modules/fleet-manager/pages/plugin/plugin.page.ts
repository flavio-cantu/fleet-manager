import { Component } from "@angular/core"
import { UserService } from "../../../../services/user.service"
import { ManagerModule } from "../../fleet-manager.module"

@Component({
  selector: "page-plugin",
  standalone: true,
  imports: [ManagerModule],
  templateUrl: "./plugin.page.html",
  styleUrls: ["./plugin.page.scss"],
})
export class PluginPage {
  loading = false
  errorMessage = ""

  constructor(private userService: UserService) { }


  download() {
    this.userService.downloadPlugin().subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'plugin.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro no download:', error);
      }
    });
  }
}
