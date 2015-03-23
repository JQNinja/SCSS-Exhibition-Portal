using System;

namespace ScssDemoPortal.Models
{
    public class ViewModel
    {
        public string Id { get; private set; }
        public bool IsSolution { get; private set; }

        private readonly int id;

        public string Next
        {
            get { return (id + 1).ToString(); }
        }

        public string Prev
        {
            get { return ((id - 1) >= 0 ? (id - 1) : 0).ToString(); }
        }

        public ViewModel(string id, bool isSolution = false)
        {
            Id = id;
            IsSolution = isSolution;
            var success = Int32.TryParse(id, out this.id);

            if (!success)
            {
                Id = "0";
                this.id = 0;
            }
        }
    }
}