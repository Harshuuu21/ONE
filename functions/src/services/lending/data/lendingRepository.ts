import { db } from "../../../config/firebase";
import { LoanRequestDocument, LoanDocument, InstallmentDocument, RepaymentDocument } from "../models/schemas";

export const persistLoanRequest = async (request: LoanRequestDocument): Promise<string> => {
    const docRef = db.collection("loan_requests").doc();
    await docRef.set({ ...request, id: docRef.id });
    return docRef.id;
};

export const persistLoan = async (loan: LoanDocument): Promise<string> => {
    const docRef = db.collection("loans").doc();
    await docRef.set({ ...loan, id: docRef.id });
    return docRef.id;
};

export const persistInstallments = async (installments: InstallmentDocument[]): Promise<void> => {
    const batch = db.batch();
    installments.forEach(inst => {
        const docRef = db.collection("loan_installments").doc();
        inst.id = docRef.id;
        batch.set(docRef, inst);
    });
    await batch.commit();
};

export const persistRepayment = async (repayment: RepaymentDocument): Promise<string> => {
    const docRef = db.collection("loan_repayments").doc();
    await docRef.set({ ...repayment, id: docRef.id });
    return docRef.id;
};

// Exposure queries
export const getActiveLoansForLender = async (lenderUid: string): Promise<LoanDocument[]> => {
    const snapshot = await db.collection("loans")
        .where("lenderUid", "==", lenderUid)
        .where("status", "==", "ACTIVE")
        .get();
    return snapshot.docs.map(doc => doc.data() as LoanDocument);
};

export const getActiveLoansForBorrower = async (borrowerUid: string): Promise<LoanDocument[]> => {
    const snapshot = await db.collection("loans")
        .where("borrowerUid", "==", borrowerUid)
        .where("status", "==", "ACTIVE")
        .get();
    return snapshot.docs.map(doc => doc.data() as LoanDocument);
};
