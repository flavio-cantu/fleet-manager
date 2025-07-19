import { Component, ViewEncapsulation, type OnInit } from "@angular/core"
import { User } from "../../../../../models/user.model"
import { UserService } from "../../../../../services/user.service"
import { ManagerModule } from "../../../fleet-manager.module"
import { ModalService } from "../../../../shared/components/modal/modal.service"
import { ActionsProperty, TableProperty } from "../../../../shared/components/table/app-client-table.component"

@Component({
  selector: "page-user-list",
  standalone: true,
  imports: [ManagerModule],
  templateUrl: "./user-list.page.html",
  styleUrls: ["./user-list.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListPage implements OnInit {
  users: User[] = []
  loading = true
  errorMessage = ""

  columnsUser: TableProperty[] = [{
    name: 'USER_LIST.NICKNAME',
    field: 'nickname'
  }, {
    name: 'USER_LIST.EMAIL',
    field: 'email'
  }, {
    name: 'USER_LIST.AUTHORIZED',
    field: 'authorized'
  }
  ];


  constructor(private userService: UserService,
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
      error: (errors) => {
        this.errorMessage = errors;
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
            error: (errors) => {
              this.errorMessage = errors;
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
            error: (errors) => {
              this.errorMessage = errors;
            },
          });
        }
      });
  }
}
