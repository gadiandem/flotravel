import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";

import { Agent } from "src/app/model/auth/agency/agency";
import { AgentInfo } from "src/app/model/auth/agency/agent-info";
import { Tariff } from "src/app/model/auth/agency/tariff";
import { UserDetail } from "src/app/model/auth/user/user-detail";

@Component({
  selector: "app-agent-create-pannel",
  templateUrl: "./agent-create-pannel.component.html",
  styleUrls: ["./agent-create-pannel.component.css"],
})
export class AgentCreatePannelComponent implements OnInit {
  subAgentForm: FormGroup;
  agentDetail: Agent;
  isShowFormSubAgent: boolean;
  account: UserDetail;
  formSubAgentError: boolean;
  editAgent: Agent;

  public event: EventEmitter<Agent> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.formSubAgentError = false;
    this.initSubAgentCreateForm();
    if(this.editAgent){
      this.updateSubAgentForm(this.editAgent)
    }
  }

  initSubAgentCreateForm() {
    this.subAgentForm = new FormGroup({
      // agentId: new FormControl("", Validators.required),
      agentInfo: new FormGroup({
        address: new FormControl("", Validators.required),
        // logo: new FormControl("", Validators.required),
        // website: new FormControl("", Validators.required),
      }),
      // tariff: new FormGroup({
      //   hotel_nuitee: new FormControl("", [
      //     Validators.required,
      //     Validators.pattern("^[0-9]+$"),
      //   ]),
      //   flight_NDC: new FormControl("", [
      //     Validators.required,
      //     Validators.pattern("^[0-9]+$"),
      //   ]),
      //   thingToDo: new FormControl("", [
      //     Validators.required,
      //     Validators.pattern("^[0-9]+$"),
      //   ]),
      //   insurance: new FormControl("", [
      //     Validators.required,
      //     Validators.pattern("^[0-9]+$"),
      //   ]),
      // }),
      name: new FormControl("", Validators.required),
    });
  }

  updateSubAgentForm(agent: Agent) {
    if (!agent.tariff) {
      agent.tariff = new Tariff();
    }
    this.subAgentForm.patchValue({
      // agentId: agent.agentId,
      agentInfo: {
        address: agent.agentInfo.address,
        // logo: agent.agentInfo.logo,
        // website: agent.agentInfo.website,
      },
      // tariff: {
      //   hotel_nuitee: agent.tariff.hotel_nuitee || "",
      //   flight_NDC: agent.tariff.flight_NDC || "",
      //   // thingToDo: agent.tariff.thingToDo || "",
      //   traceMe: agent.tariff.traceMe || "",
      //   tourPackage: agent.tariff.tourPackage || "",
      //   insurance: agent.tariff.insurance || "",
      // },
      name: agent.name,
    });
  }

  saveSubAgent() {
    if (this.subAgentForm.valid) {
      const d: Agent = this.subAgentForm.value;
      let agency: Agent = this.editAgent;
      if(!this.editAgent){
        agency = new Agent();
        const agentInfo = new AgentInfo();
        agency.agentInfo = agentInfo;
      }
      agency.agentInfo.address = d.agentInfo.address;
      // agency.agentInfo.logo = d.agentInfo.logo;
      // agency.agentInfo.website = d.agentInfo.website;
      agency.name = d.name;
      agency.parent = this.agentDetail.id;
      // const tariff = new Tariff();
      // tariff.hotel_nuitee = d.tariff.hotel_nuitee;
      // tariff.flight_NDC = d.tariff.flight_NDC;
      // // tariff.thingToDo = d.tariff.thingToDo;
      // tariff.traceMe = d.tariff.traceMe;
      // tariff.tourPackage = d.tariff.tourPackage;
      // tariff.insurance = d.tariff.insurance;
      // agency.tariff = tariff;
      this.event.emit(agency);
      this.bsModalRef.hide();
    } else {
      this.formSubAgentError = true;
      return;
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    this.saveSubAgent();
  }
}
