import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { NavComponent } from "../../../components/nav/nav.component"
import { TranslatorService } from "../../../services/translator.service"
import { User } from "../../../models/user.model"
import { UserService } from "../../../services/user.service"
import { ModalService } from "../../../components/modal/modal.service"

@Component({
  selector: "page-user-list",
  standalone: true,
  imports: [CommonModule, NavComponent, TranslateModule],
  templateUrl: "./user-list.page.html",
  styleUrls: ["./user-list.page.scss"],
})
export class UserListPage implements OnInit {
  users: User[] = []
  loading = true
  errorMessage = ""

  constructor(private userService: UserService,
    private translator: TranslatorService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.loading = true
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        this.loading = false
      },
      error: (errorCode) => {
        this.errorMessage = this.translator.translate(errorCode);
        this.loading = false
      },
    })
  }

  deleteUser(id: string | undefined): void {
    this.modalService.delete('USER_LIST.DELETE_OPTION',
      'USER_LIST.DELETE_OPTION_DESCRIPTION').subscribe((result) => {
        if (result) {
          this.userService.deleteUser(id!!).subscribe({
            next: () => {
              this.loadUsers()
            },
            error: (errorCode) => {
              this.errorMessage = this.translator.translate(errorCode);
            },
          });
        }
      });
  }

  allowUser(allow: boolean, id: string | undefined) {
    this.modalService.confirm('USER_LIST.ALLOW_OPTION',
      'USER_LIST.ALLOW_OPTION_DESCRIPTION').subscribe((result) => {
        if (result) {
          this.userService.allowUser(allow, id!!).subscribe({
            next: () => {
              this.loadUsers()
            },
            error: (errorCode) => {
              this.errorMessage = this.translator.translate(errorCode);
            },
          });
        }
      });
  }
}
