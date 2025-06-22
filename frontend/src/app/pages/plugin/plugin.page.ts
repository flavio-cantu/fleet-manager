import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { NavComponent } from "../../components/nav/nav.component"
import { UserService } from "../../services/user.service"

@Component({
  selector: "page-plugin",
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, TranslateModule],
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
